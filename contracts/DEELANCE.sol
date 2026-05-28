// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
contract DEELANCE {

    event InternshipAdded(
        uint256 indexed internshipId,
        address indexed company,
        uint256 companyStake,
        uint256 duration1,
        uint256 gapBetweenTwoDurations,
        bytes32 detailHash
    );

    event InternshipClaimed(
        uint256 indexed internshipId,
        address indexed intern,
        address indexed company,
        uint256 internStake,
        uint256 startTime
    );

    event InternshipRemoved(
        uint256 indexed internshipId,
        address indexed company,
        uint256 refundAmount
    );

    event StakeSlashed(
        uint256 indexed internshipId,
        uint256 companySlashAmount,
        uint256 internSlashAmount,
        uint256 remainingPool
    );

    event InternshipExpired(
        uint256 indexed internshipId,
        address indexed intern,
        uint256 timestamp
    );

    address payable internal s_ownerOfDELANCE;
    constructor() {
        s_ownerOfDELANCE = payable(msg.sender);
    }

    modifier onlyOwnerOfDELANCE {
        require(msg.sender == s_ownerOfDELANCE, 
        "Only the owner of DELANCE can perform this action.");
        _;
    }

    mapping (address => uint256) internal s_numberOfOngoingInterships_ForCompany;
    mapping (uint256 => address) internal s_internshipIdToCompany;

    mapping (address => uint256) internal s_numberOfOngoingInterships_ForIntern;
    mapping (uint256 => address) internal s_internshipIdToIntern;

    struct Internship {
        address payable s_company;
        address payable s_intern;
        uint256 s_startTime;
        uint256 s_companyStake;
        uint256 s_internStake;
        uint256 s_duration1;
        uint256 s_gapBetweenTwoDurations;
        bytes32 s_detailHash;
        bytes32 s_submissionHash;
        bool s_isOpen;
    }

    // S6 FIX: Changed > to >= so exactly 0.01 ether is accepted
    modifier nonZeroAmountChecker_CompanyStake {
        require(msg.value >= 1* 10 ** 16 , 
        "You need to send atleast 0.01 ether for the Internship to be created.");
        _;
    }

    mapping (uint256 => Internship) internal s_internships;
    mapping (uint256 => uint256) internal s_poolOfInternshipId;

    // S7 FIX: Made totalInternships public so frontend can read it
    uint256 public totalInternships;

    // Tracks how many slash periods have been applied for each internship
    mapping (uint256 => uint256) internal s_slashesApplied;
    
    //allows a company to add a new internship by specifying the first duration and gap between durations, and the 
    //conditions that are on web2 but hashed into web3 as a submissionHash
    function addInternship_ForCompany(uint256 _firstDurationAsDays, uint256 _gapBetweenTwoDurationsAsDays, string memory _detailHash) external 
    payable nonZeroAmountChecker_CompanyStake {
        require(_firstDurationAsDays > 0, "Duration must be greater than 0");
        require(_gapBetweenTwoDurationsAsDays > 0, "Gap must be greater than 0");
        require(_firstDurationAsDays <= 365, "Duration cannot exceed 365 days");
        require(_gapBetweenTwoDurationsAsDays <= 365, "Gap cannot exceed 365 days");
        Internship memory newInternship = Internship({
            s_company: payable(msg.sender),
            s_intern: payable(address(0)),
            s_startTime: 0,
            s_companyStake: msg.value,
            s_internStake: 0,
            s_duration1: _firstDurationAsDays * 1 days,
            s_gapBetweenTwoDurations: _gapBetweenTwoDurationsAsDays * 1 days,
            s_detailHash: keccak256(abi.encodePacked(_detailHash)),
            s_submissionHash: "",
            s_isOpen: true
        });
        totalInternships += 1;
        s_numberOfOngoingInterships_ForCompany[msg.sender] += 1;
        s_internships[totalInternships] = newInternship;
        uint id = totalInternships;
        s_internshipIdToCompany[id] = msg.sender;
        emit InternshipAdded(
            id,
            msg.sender,
            msg.value,
            newInternship.s_duration1,
            newInternship.s_gapBetweenTwoDurations,
            newInternship.s_detailHash
        );
    }

    modifier isAssociatedWithInternship_Company(uint256 _internshipId) {
        require(s_internships[_internshipId].s_company == msg.sender, 
        "You are not associated with the internship you're trying to access.");
        _;
    }

    modifier unclaimedInternshipChecker(uint256 _internshipId) {
        require(s_internships[_internshipId].s_intern == address(0), 
        "This internship has already been claimed.");
        require(s_internships[_internshipId].s_company != msg.sender, 
        "You cannot claim your own internship.");
        _;
    }

    //allows an intern to claim an unclaimed internship by sending 7.5% of the company's stake as their stake
    function claimInternship_ForIntern(uint256 _internshipId) external payable 
    unclaimedInternshipChecker(_internshipId) {
        Internship storage internship = s_internships[_internshipId];
        uint256 requiredInternStake = internship.s_companyStake*75/1000;
        require(msg.value == requiredInternStake, 
        "You need to send exactly 7.5% of the company's stake to claim this internship.");
        internship.s_intern = payable(msg.sender);
        internship.s_internStake = msg.value;
        internship.s_startTime = block.timestamp;
        s_numberOfOngoingInterships_ForIntern[msg.sender] += 1;
        s_internshipIdToIntern[_internshipId] = msg.sender;
        internship.s_isOpen = false;
        s_poolOfInternshipId[_internshipId] = internship.s_companyStake + internship.s_internStake;
        s_slashesApplied[_internshipId] = 0;
        emit InternshipClaimed(
            _internshipId,
            msg.sender,
            internship.s_company,
            msg.value,
            internship.s_startTime
        );
    }

    modifier internshipClaimedChecker(uint256 _internshipId) {
        require(!s_internships[_internshipId].s_isOpen, 
        "This internship has not been claimed yet.");
        _;
    }

    //allows a company to remove an unsubmitted internship and refunds their stake minus a 2% fee to DELANCE if the
    //internship has not been claimed by any intern yet
    function removeInternship_ForCompany_Unsubmitted(uint256 _internshipId) public
    isAssociatedWithInternship_Company(_internshipId) {
        Internship storage internship = s_internships[_internshipId];
        require(internship.s_isOpen,"Internship has already been claimed by an intern. You cannot remove it.");
        address payable companyAddress = internship.s_company;
        uint256 companyStake = internship.s_companyStake*98/100;
        emit InternshipRemoved(
            _internshipId,
            msg.sender,
            companyStake
        );
        (bool success, ) = companyAddress.call{value: companyStake}("");
        require(success, "Transfer failed - Couldn't refund company stake");
        (bool success2, ) = s_ownerOfDELANCE.call{value: internship.s_companyStake - companyStake}(""); 
        require(success2, "Transfer failed - Couldn't pay DELANCE");
        s_numberOfOngoingInterships_ForCompany[msg.sender] -= 1;
        delete s_internshipIdToCompany[_internshipId];
        delete s_internships[_internshipId];
    }

    modifier isAssociatedWithInternship_Intern(uint256 _internshipId) {
        require(s_internships[_internshipId].s_intern == msg.sender, 
        "You are not associated with the internship you're trying to access.");
        _;
    }

    modifier isAssociatedWithInternship_InternOrCompany(uint256 _internshipId) {
        require(s_internships[_internshipId].s_intern == msg.sender || 
        s_internships[_internshipId].s_company == msg.sender, 
        "You are not associated with the internship you're trying to access.");
        _;
    }

    //Returns the details of a specific internship by its ID
    function viewOneInternshipDetails(uint256 _internshipId) public view returns (Internship memory) {
        return s_internships[_internshipId];
    }

    // S2 FIX: This internal function reduces the pool and sends BOTH company and intern slash to DELANCE owner.
    // Previously, company slash was subtracted from pool but never transferred anywhere.
    function reducePoolOfInternship_ForCompany_DELANCE (uint256 _internshipId, uint256 amountCompany, uint256 amountIntern) internal {
        Internship storage internship = s_internships[_internshipId];
        (bool success1, ) = s_ownerOfDELANCE.call{value: amountCompany}("");
        require(success1, "Transfer failed - Couldn't pay DELANCE (company slash)");
        (bool success2, ) = s_ownerOfDELANCE.call{value: amountIntern}("");
        require(success2, "Transfer failed - Couldn't pay DELANCE (intern slash)");
        internship.s_companyStake -= amountCompany;
        internship.s_internStake -= amountIntern;
        s_poolOfInternshipId[_internshipId] -= (amountIntern + amountCompany);
        emit StakeSlashed(
            _internshipId,
            amountCompany,
            amountIntern,
            s_poolOfInternshipId[_internshipId]
        );
    }

    function _applySlash(uint256 _internshipId, uint256 poolNow, uint256 slashPercent, Internship storage internship) internal {
        uint256 totalSlash = poolNow * slashPercent / 100;
        uint256 totalStakes = internship.s_companyStake + internship.s_internStake;
        uint256 companySlash;
        uint256 internSlash;
        if (totalStakes > 0) {
            companySlash = totalSlash * internship.s_companyStake / totalStakes;
            internSlash = totalSlash - companySlash;
        } else {
            companySlash = totalSlash;
            internSlash = 0;
        }
        // Clamp to available stakes
        if (companySlash > internship.s_companyStake) companySlash = internship.s_companyStake;
        if (internSlash > internship.s_internStake) internSlash = internship.s_internStake;
        
        reducePoolOfInternship_ForCompany_DELANCE(_internshipId, companySlash, internSlash);
    }

    // S1 FIX: True progressive slashing of REMAINING pool at each missed deadline.
    // 1st missed: 20% of remaining, 2nd: 40% of remaining, 3rd: 60%, 4th: 80%, 5th: 100%
    function InternshipTimeCheckerAndPayer_ForCompany(uint256 _internshipId) external 
    isAssociatedWithInternship_Company(_internshipId) internshipClaimedChecker(_internshipId) {
        Internship storage internship = s_internships[_internshipId];
        uint256 duration1EndTime = internship.s_startTime + internship.s_duration1;
        
        // Not past first deadline yet
        if (block.timestamp <= duration1EndTime) return;

        // Determine which deadline period we're in (1-based, capped at 5)
        uint256 elapsed = block.timestamp - duration1EndTime;
        uint256 period = (elapsed / internship.s_gapBetweenTwoDurations) + 1;
        if (period > 5) period = 5;

        // Progressive slash percentages: 20%, 40%, 60%, 80%, 100% of REMAINING pool
        uint256[5] memory slashPercents = [uint256(20), 40, 60, 80, 100];

        // Apply slashes for periods that haven't been slashed yet
        uint256 alreadySlashed = s_slashesApplied[_internshipId];
        
        for (uint256 p = alreadySlashed; p < period && p < 5; p++) {
            uint256 poolNow = s_poolOfInternshipId[_internshipId];
            if (poolNow == 0) break;

            _applySlash(_internshipId, poolNow, slashPercents[p], internship);
            s_slashesApplied[_internshipId] = p + 1;
        }

        // If 5th period reached and pool is zero, expire the internship
        if (period >= 5 && s_poolOfInternshipId[_internshipId] == 0) {
            address internAddress = internship.s_intern;
            if (internAddress != address(0)) {
                s_numberOfOngoingInterships_ForIntern[internAddress] -= 1;
                emit InternshipExpired(_internshipId, internAddress, block.timestamp);
                internship.s_intern = payable(address(0));
                internship.s_startTime = 0;
                internship.s_internStake = 0;
                internship.s_companyStake = 0;
                internship.s_isOpen = true;
            }
        }
    }

    //This function returns the list of internship IDs associated with the caller (either as a company or an intern)
    function getOngoingInternships_ForCompanyAndIntern() external view returns (Internship[] memory ) {
        address payable _user = payable(msg.sender);
        uint256 count = 0;
        for(uint256 i = 1; i <= totalInternships; i++) {
            if(s_internships[i].s_company == _user || s_internships[i].s_intern == _user) {
                count++;
            }
        }
        Internship[] memory internship = new Internship[](count);
        uint256 index = 0;
        for(uint256 i = 1; i <= totalInternships; i++) {
            if(s_internships[i].s_company == _user || s_internships[i].s_intern == _user) {
                internship[index] = viewOneInternshipDetails(i);
                index++;
            }
        }
        return internship;
    }

    function getOpenInternships_forInterns() external view returns (Internship[] memory ) {
        uint256 count = 0;
        for(uint256 i = 1; i <= totalInternships; i++) {
            if(s_internships[i].s_isOpen) {
                count++;
            }
        }
        Internship[] memory internship = new Internship[](count);
        uint256 index = 0;
        for(uint256 i = 1; i <= totalInternships; i++) {
            if(s_internships[i].s_isOpen) {
                internship[index] = viewOneInternshipDetails(i);
                index++;
            }
        }
        return internship;
    }   

    function submitInternshipWork_ForIntern(uint256 _internshipId, string memory _description) external 
    isAssociatedWithInternship_Intern(_internshipId) {
        Internship storage internship = s_internships[_internshipId];
        internship.s_submissionHash = keccak256(abi.encodePacked(_description));
        startVotingSession(_internshipId);
    }

    //VOTING CONTRACT CODE STARTS HERE  

    struct Vote {
        bool hasVoted;
        bool vote;
        uint256 stake;
    }

    struct VotingSession {
        uint256 taskId;
        uint256 startTime;
        uint256 endTime;
        uint256 yesVotes;
        uint256 noVotes;
        bool isActive;
        bool isFinalized;
        bool result;
        mapping(address => Vote) votes;
        address payable[] voters;
        mapping(bool => uint256) bool_Stake;
    }
    
    mapping (uint256 => VotingSession) public votingSession;
    
    uint256 public constant MIN_STAKE = 0.01 ether;
    uint256 public constant MAX_STAKE = 0.05 ether;
    uint256 public constant VOTING_PERIOD = 1 days;
    
    event VotingSessionStarted(uint256 indexed taskId, uint256 endTime);
    event VoteCast(uint256 indexed taskId, address indexed voter, bool vote, uint256 stake);
    event VotingFinalized(uint256 indexed taskId, bool result, uint256 yesVotes, uint256 noVotes);
    event VotingRewardsDistributed(uint256 indexed taskId);
   
    // S5 FIX: Clears voters array and stake tallies before starting a new session
    function startVotingSession(uint256 _internshipId) internal {
        require(!votingSession[_internshipId].isActive, "Voting already active");
        VotingSession storage session = votingSession[_internshipId];
        session.taskId = _internshipId;
        session.startTime = block.timestamp;
        session.endTime = block.timestamp + VOTING_PERIOD;
        session.yesVotes = 0;
        session.noVotes = 0;
        session.isActive = true;
        session.isFinalized = false;
        // Clear voters from previous session
        delete session.voters;
        session.bool_Stake[true] = 0;
        session.bool_Stake[false] = 0;
        emit VotingSessionStarted(_internshipId, session.endTime);
    }
    
    // Cast vote, calling this would help users cast their votes
    function castVote(uint256 _internshipId, bool vote) public payable {
        VotingSession storage session = votingSession[_internshipId];
        require(session.isActive, "Voting not active");
        require(block.timestamp <= session.endTime, "Voting period ended");
        require(!session.votes[msg.sender].hasVoted, "Already voted");
        require(msg.value >= MIN_STAKE && msg.value <= MAX_STAKE, "Invalid stake amount, must be between 0.01 and 0.05 ether");
        session.voters.push(payable(msg.sender));
        session.votes[msg.sender] = Vote({
            hasVoted: true,
            vote: vote,
            stake: msg.value
        });

        if (vote) {
            session.yesVotes += 1;
            session.bool_Stake[true] += msg.value;
        } else {
            session.noVotes += 1;
            session.bool_Stake[false] += msg.value;
        }
        
        emit VoteCast(_internshipId, msg.sender, vote, msg.value);
    }
    
    // S4+S3 FIX: Zero-voter guard + rewards proportional to stake (not equal by count)
    function finalizeVoting(uint256 _internshipId) external isAssociatedWithInternship_InternOrCompany(_internshipId) {
        Internship storage internship = s_internships[_internshipId];
        VotingSession storage session = votingSession[_internshipId];
        require(session.isActive, "Voting not active");
        require(block.timestamp > session.endTime, "Voting period not ended");
        require(!session.isFinalized, "Already finalized");

        session.isActive = false;
        session.isFinalized = true;
        bool approved;
        // Tie-breaker: 50/50 stake split resolves as YES (approved = true)
        if(session.bool_Stake[true] >= session.bool_Stake[false]) {
            approved = session.result = true;
        } else {
            approved = session.result = false;
        }
        
        // 5% of escrow pool goes to voter reward pool
        uint256 totalRewardPool = s_poolOfInternshipId[_internshipId] * 5 / 100;
        s_poolOfInternshipId[_internshipId] -= totalRewardPool;

        // S4 FIX: Only distribute rewards if there are voters (prevents division by zero)
        if (session.voters.length > 0) {
            // S3 FIX: Rewards proportional to voter's stake relative to total winning-side stake
            uint256 totalWinningStake = approved ? session.bool_Stake[true] : session.bool_Stake[false];
            for (uint256 i = 0; i < session.voters.length; i++) {
                address voterAddress = session.voters[i];
                Vote storage voterVote = session.votes[voterAddress];
                if (voterVote.vote == approved) {
                    // Winner: stake back + proportional share of reward pool
                    uint256 reward = 0;
                    if (totalWinningStake > 0) {
                        reward = totalRewardPool * voterVote.stake / totalWinningStake;
                    }
                    (bool success, ) = payable(voterAddress).call{value: voterVote.stake + reward}("");
                    require(success, "Transfer failed - Couldn't pay voter");
                } else {
                    // Loser: 20% of stake returned, 80% slashed to DELANCE owner
                    uint256 returnAmount = voterVote.stake * 20 / 100;
                    uint256 slashAmount = voterVote.stake * 80 / 100;
                    (bool success, ) = payable(voterAddress).call{value: returnAmount}("");
                    (bool success2, ) = s_ownerOfDELANCE.call{value: slashAmount}("");
                    require(success, "Transfer failed - Couldn't pay voter");
                    require(success2, "Transfer to DELANCE HQ failed");
                }
            }
        }

        emit VotingRewardsDistributed(_internshipId);
        
        if (approved) {
            emit VotingFinalized(_internshipId, approved, session.bool_Stake[true], session.bool_Stake[false]);
            (bool success, ) = internship.s_intern.call{value: s_poolOfInternshipId[_internshipId]}("");
            require(success, "Transfer failed - Couldn't pay intern");
            s_numberOfOngoingInterships_ForIntern[internship.s_intern] -= 1;
            s_numberOfOngoingInterships_ForCompany[internship.s_company] -= 1;
            delete s_internshipIdToIntern[_internshipId];
            delete s_internshipIdToCompany[_internshipId];
            delete s_internships[_internshipId];
        } else {
            internship.s_submissionHash = "";
            emit VotingFinalized(_internshipId, approved, session.bool_Stake[true], session.bool_Stake[false]);
        }
    }
    
    function getVotingSession(uint256 taskId) external view returns (
        uint256 startTime,
        uint256 endTime,
        bool isActive,
        bool isFinalized,
        uint256 yesVotes,
        uint256 noVotes
    ) {
        VotingSession storage session = votingSession[taskId];
        return (
            session.startTime,
            session.endTime,
            session.isActive,
            session.isFinalized,
            session.yesVotes,
            session.noVotes
        );
    }   
}
