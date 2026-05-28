export const contractAddress = "0x36B36D9c0EF270b985FfeF8217923FadFa5A7532";
export const RPC_URL = "https://sepolia.infura.io/v3/35259764d8e647d2a986752e3b7aa35e"
export const ABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_firstDurationAsDays",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_gapBetweenTwoDurationsAsDays",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_detailHash",
				"type": "string"
			}
		],
		"name": "addInternship_ForCompany",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_internshipId",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "vote",
				"type": "bool"
			}
		],
		"name": "castVote",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_internshipId",
				"type": "uint256"
			}
		],
		"name": "claimInternship_ForIntern",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_internshipId",
				"type": "uint256"
			}
		],
		"name": "finalizeVoting",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "internshipId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "company",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "companyStake",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "duration1",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "gapBetweenTwoDurations",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "detailHash",
				"type": "bytes32"
			}
		],
		"name": "InternshipAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "internshipId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "intern",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "company",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "internStake",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "startTime",
				"type": "uint256"
			}
		],
		"name": "InternshipClaimed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "internshipId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "intern",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "InternshipExpired",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "internshipId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "company",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "refundAmount",
				"type": "uint256"
			}
		],
		"name": "InternshipRemoved",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_internshipId",
				"type": "uint256"
			}
		],
		"name": "InternshipTimeCheckerAndPayer_ForCompany",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_internshipId",
				"type": "uint256"
			}
		],
		"name": "removeInternship_ForCompany_Unsubmitted",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "internshipId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "companySlashAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "internSlashAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "remainingPool",
				"type": "uint256"
			}
		],
		"name": "StakeSlashed",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_internshipId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			}
		],
		"name": "submitInternshipWork_ForIntern",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "taskId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "voter",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "vote",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "stake",
				"type": "uint256"
			}
		],
		"name": "VoteCast",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "taskId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "result",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "yesVotes",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "noVotes",
				"type": "uint256"
			}
		],
		"name": "VotingFinalized",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "taskId",
				"type": "uint256"
			}
		],
		"name": "VotingRewardsDistributed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "taskId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "endTime",
				"type": "uint256"
			}
		],
		"name": "VotingSessionStarted",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "getOngoingInternships_ForCompanyAndIntern",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address payable",
						"name": "s_company",
						"type": "address"
					},
					{
						"internalType": "address payable",
						"name": "s_intern",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "s_startTime",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "s_companyStake",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "s_internStake",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "s_duration1",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "s_gapBetweenTwoDurations",
						"type": "uint256"
					},
					{
						"internalType": "bytes32",
						"name": "s_detailHash",
						"type": "bytes32"
					},
					{
						"internalType": "bytes32",
						"name": "s_submissionHash",
						"type": "bytes32"
					},
					{
						"internalType": "bool",
						"name": "s_isOpen",
						"type": "bool"
					}
				],
				"internalType": "struct DEELANCE.Internship[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getOpenInternships_forInterns",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address payable",
						"name": "s_company",
						"type": "address"
					},
					{
						"internalType": "address payable",
						"name": "s_intern",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "s_startTime",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "s_companyStake",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "s_internStake",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "s_duration1",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "s_gapBetweenTwoDurations",
						"type": "uint256"
					},
					{
						"internalType": "bytes32",
						"name": "s_detailHash",
						"type": "bytes32"
					},
					{
						"internalType": "bytes32",
						"name": "s_submissionHash",
						"type": "bytes32"
					},
					{
						"internalType": "bool",
						"name": "s_isOpen",
						"type": "bool"
					}
				],
				"internalType": "struct DEELANCE.Internship[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "taskId",
				"type": "uint256"
			}
		],
		"name": "getVotingSession",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "startTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "endTime",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "isFinalized",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "yesVotes",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "noVotes",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "MAX_STAKE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "MIN_STAKE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_internshipId",
				"type": "uint256"
			}
		],
		"name": "viewOneInternshipDetails",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address payable",
						"name": "s_company",
						"type": "address"
					},
					{
						"internalType": "address payable",
						"name": "s_intern",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "s_startTime",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "s_companyStake",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "s_internStake",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "s_duration1",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "s_gapBetweenTwoDurations",
						"type": "uint256"
					},
					{
						"internalType": "bytes32",
						"name": "s_detailHash",
						"type": "bytes32"
					},
					{
						"internalType": "bytes32",
						"name": "s_submissionHash",
						"type": "bytes32"
					},
					{
						"internalType": "bool",
						"name": "s_isOpen",
						"type": "bool"
					}
				],
				"internalType": "struct DEELANCE.Internship",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "VOTING_PERIOD",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "votingSession",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "taskId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "startTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "endTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "yesVotes",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "noVotes",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "isFinalized",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "result",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
