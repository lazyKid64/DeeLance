const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { isDbConnected } = require("../config/db");

// In-memory user store (fallback when MongoDB is unavailable)
const memoryUsers = [];

// Input validation helpers
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateLoginInput(body) {
  const { handle, email, password, type } = body;
  if (!handle || !email || !password || !type) {
    return "All fields are required (handle, email, password, type).";
  }
  if (typeof handle !== "string" || handle.trim().length < 2 || handle.trim().length > 50) {
    return "Handle must be 2–50 characters.";
  }
  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return "Please enter a valid email address.";
  }
  if (typeof password !== "string" || password.length < 4) {
    return "Password must be at least 4 characters.";
  }
  if (type !== "company" && type !== "freelance") {
    return 'Type must be "company" or "freelance".';
  }
  return null; // Valid
}

function toSafeUser(user) {
  const u = user.toObject ? user.toObject() : { ...user };
  delete u.password;
  return u;
}

exports.login = async (req, res) => {
  try {
    const validationError = validateLoginInput(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const { handle, email, password, type } = req.body;
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedHandle = handle.trim();

    // Use MongoDB if connected, otherwise in-memory fallback
    if (isDbConnected()) {
      let user = await User.findOne({ email: trimmedEmail });

      if (!user) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user = await User.create({
          handle: trimmedHandle,
          email: trimmedEmail,
          password: hashedPassword,
          type,
        });
        return res.status(201).json(toSafeUser(user));
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Update type and handle to match current login selection
      user.type = type;
      user.handle = trimmedHandle;
      await user.save();

      res.json(toSafeUser(user));
    } else {
      // In-memory fallback for demo
      let user = memoryUsers.find((u) => u.email === trimmedEmail);

      if (!user) {
        user = {
          _id: Date.now().toString(),
          handle: trimmedHandle,
          email: trimmedEmail,
          password,
          type,
          createdAt: new Date().toISOString(),
        };
        memoryUsers.push(user);
        const safe = { ...user };
        delete safe.password;
        return res.status(201).json(safe);
      }

      if (user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Update type and handle to match current login selection
      user.type = type;
      user.handle = trimmedHandle;

      const safe = { ...user };
      delete safe.password;
      res.json(safe);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
