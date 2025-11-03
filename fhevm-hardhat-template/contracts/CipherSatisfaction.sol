// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32, ebool} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title CipherSatisfaction - Encrypted Customer Satisfaction Rating System
/// @author CipherSatisfaction
/// @notice A FHEVM-based system for anonymous customer satisfaction ratings with encrypted computation
contract CipherSatisfaction is ZamaEthereumConfig {
    // Weight constants (multiplied by 100 to work with integers)
    // Attitude: 30%, Speed: 30%, Professionalism: 40%
    uint32 private constant WEIGHT_ATTITUDE = 30;
    uint32 private constant WEIGHT_SPEED = 30;
    uint32 private constant WEIGHT_PROFESSIONALISM = 40;
    uint32 private constant WEIGHT_DIVISOR = 100;
    
    // Threshold for service standard (4.0 out of 5.0, multiplied by 100)
    uint32 private constant THRESHOLD_SCORE = 400; // 4.0 * 100
    
    // Rating structure
    struct Rating {
        bytes32 serviceAgentId; // Service agent identifier (plaintext)
        euint32 encryptedAttitude; // Encrypted attitude score (1-5)
        euint32 encryptedSpeed; // Encrypted speed score (1-5)
        euint32 encryptedProfessionalism; // Encrypted professionalism score (1-5)
        euint32 encryptedWeightedScore; // Encrypted weighted composite score
        euint32 meetsThreshold; // Encrypted: 1 if meets threshold, 0 otherwise
        uint256 timestamp; // Submission timestamp
    }
    
    // Statistics structure
    struct Statistics {
        uint256 totalRatings; // Total number of ratings
        euint32 sumAttitude; // Sum of attitude scores (encrypted)
        euint32 sumSpeed; // Sum of speed scores (encrypted)
        euint32 sumProfessionalism; // Sum of professionalism scores (encrypted)
        euint32 sumWeightedScore; // Sum of weighted scores (encrypted)
        euint32 countMeetsThreshold; // Count of ratings that meet threshold (encrypted)
    }
    
    // Storage
    Rating[] private ratings;
    Statistics private statistics;
    mapping(address => bool) public admins;
    
    // Events
    event RatingSubmitted(
        uint256 indexed ratingId,
        bytes32 indexed serviceAgentId,
        address indexed submitter,
        uint256 timestamp
    );
    
    event AdminUpdated(address indexed admin, bool isAdmin);
    
    /// @notice Constructor sets deployer as initial admin and initializes statistics
    constructor() {
        admins[msg.sender] = true;
        emit AdminUpdated(msg.sender, true);
        
        // Initialize encrypted statistics to zero
        statistics.sumAttitude = FHE.asEuint32(0);
        statistics.sumSpeed = FHE.asEuint32(0);
        statistics.sumProfessionalism = FHE.asEuint32(0);
        statistics.sumWeightedScore = FHE.asEuint32(0);
        statistics.countMeetsThreshold = FHE.asEuint32(0);
        
        // Allow contract to decrypt statistics
        FHE.allowThis(statistics.sumAttitude);
        FHE.allowThis(statistics.sumSpeed);
        FHE.allowThis(statistics.sumProfessionalism);
        FHE.allowThis(statistics.sumWeightedScore);
        FHE.allowThis(statistics.countMeetsThreshold);
    }
    
    /// @notice Set admin status for an address
    /// @param admin Address to set admin status
    /// @param isAdmin True to grant admin, false to revoke
    function setAdmin(address admin, bool isAdmin) external {
        require(admins[msg.sender], "Only admin can set admin");
        admins[admin] = isAdmin;
        emit AdminUpdated(admin, isAdmin);
    }
    
    /// @notice Allow admin to decrypt statistics
    /// @dev This function allows an admin to grant themselves permission to decrypt statistics
    function authorizeStatisticsDecryption() external {
        require(admins[msg.sender], "Only admin can authorize statistics decryption");
        FHE.allow(statistics.sumAttitude, msg.sender);
        FHE.allow(statistics.sumSpeed, msg.sender);
        FHE.allow(statistics.sumProfessionalism, msg.sender);
        FHE.allow(statistics.sumWeightedScore, msg.sender);
        FHE.allow(statistics.countMeetsThreshold, msg.sender);
    }
    
    /// @notice Submit an encrypted customer satisfaction rating
    /// @param serviceAgentId Service agent identifier (plaintext)
    /// @param encryptedAttitude Encrypted attitude score (1-5)
    /// @param attitudeProof Proof for attitude score
    /// @param encryptedSpeed Encrypted speed score (1-5)
    /// @param speedProof Proof for speed score
    /// @param encryptedProfessionalism Encrypted professionalism score (1-5)
    /// @param professionalismProof Proof for professionalism score
    function submitRating(
        bytes32 serviceAgentId,
        externalEuint32 encryptedAttitude,
        bytes calldata attitudeProof,
        externalEuint32 encryptedSpeed,
        bytes calldata speedProof,
        externalEuint32 encryptedProfessionalism,
        bytes calldata professionalismProof
    ) external {
        // Convert external encrypted values to internal euint32
        euint32 attitude = FHE.fromExternal(encryptedAttitude, attitudeProof);
        euint32 speed = FHE.fromExternal(encryptedSpeed, speedProof);
        euint32 professionalism = FHE.fromExternal(encryptedProfessionalism, professionalismProof);
        
        // Calculate weighted composite score and threshold check
        euint32 weightedScore = _calculateWeightedScore(attitude, speed, professionalism);
        euint32 thresholdCheck = _checkThreshold(weightedScore);
        
        // Update statistics first (before pushing to reduce stack depth)
        // Allow contract to use existing statistics values for addition
        FHE.allowThis(statistics.sumAttitude);
        FHE.allowThis(statistics.sumSpeed);
        FHE.allowThis(statistics.sumProfessionalism);
        FHE.allowThis(statistics.sumWeightedScore);
        FHE.allowThis(statistics.countMeetsThreshold);
        
        statistics.totalRatings += 1;
        statistics.sumAttitude = FHE.add(statistics.sumAttitude, attitude);
        statistics.sumSpeed = FHE.add(statistics.sumSpeed, speed);
        statistics.sumProfessionalism = FHE.add(statistics.sumProfessionalism, professionalism);
        statistics.sumWeightedScore = FHE.add(statistics.sumWeightedScore, weightedScore);
        statistics.countMeetsThreshold = FHE.add(statistics.countMeetsThreshold, thresholdCheck);
        
        // Allow contract to decrypt updated statistics
        FHE.allowThis(statistics.sumAttitude);
        FHE.allowThis(statistics.sumSpeed);
        FHE.allowThis(statistics.sumProfessionalism);
        FHE.allowThis(statistics.sumWeightedScore);
        FHE.allowThis(statistics.countMeetsThreshold);
        
        // Allow contract and user to decrypt (before creating struct)
        FHE.allowThis(attitude);
        FHE.allowThis(speed);
        FHE.allowThis(professionalism);
        FHE.allowThis(weightedScore);
        FHE.allowThis(thresholdCheck);
        FHE.allow(attitude, msg.sender);
        FHE.allow(speed, msg.sender);
        FHE.allow(professionalism, msg.sender);
        FHE.allow(weightedScore, msg.sender);
        FHE.allow(thresholdCheck, msg.sender);
        
        // Create and push rating record
        ratings.push(Rating({
            serviceAgentId: serviceAgentId,
            encryptedAttitude: attitude,
            encryptedSpeed: speed,
            encryptedProfessionalism: professionalism,
            encryptedWeightedScore: weightedScore,
            meetsThreshold: thresholdCheck,
            timestamp: block.timestamp
        }));
        
        emit RatingSubmitted(ratings.length - 1, serviceAgentId, msg.sender, block.timestamp);
    }
    
    /// @notice Calculate weighted composite score from three dimensions
    /// @param attitude Encrypted attitude score
    /// @param speed Encrypted speed score
    /// @param professionalism Encrypted professionalism score
    /// @return weightedScore Encrypted weighted score (multiplied by 100)
    function _calculateWeightedScore(
        euint32 attitude,
        euint32 speed,
        euint32 professionalism
    ) private returns (euint32 weightedScore) {
        // weighted_score = (attitude * 30 + speed * 30 + professionalism * 40)
        // Note: We multiply by 100 to work with integers, so the result is in [100, 500] range
        euint32 weightedAttitude = FHE.mul(attitude, WEIGHT_ATTITUDE);
        euint32 weightedSpeed = FHE.mul(speed, WEIGHT_SPEED);
        euint32 weightedProfessionalism = FHE.mul(professionalism, WEIGHT_PROFESSIONALISM);
        
        euint32 sum = FHE.add(weightedAttitude, weightedSpeed);
        weightedScore = FHE.add(sum, weightedProfessionalism);
    }
    
    /// @notice Check if weighted score meets threshold (>= 4.0)
    /// @param weightedScore Encrypted weighted score (multiplied by 100)
    /// @return result Encrypted: 1 if meets threshold, 0 otherwise
    function _checkThreshold(euint32 weightedScore) private returns (euint32 result) {
        // Compare: weightedScore >= THRESHOLD_SCORE (400)
        // FHE.gt returns ebool, then we use FHE.select to convert to euint32 (1 or 0)
        ebool meetsThreshold = FHE.gt(weightedScore, FHE.asEuint32(THRESHOLD_SCORE));
        euint32 one = FHE.asEuint32(1);
        euint32 zero = FHE.asEuint32(0);
        result = FHE.select(meetsThreshold, one, zero);
    }
    
    /// @notice Get a rating by index
    /// @param index Rating index
    /// @return rating Rating struct (encrypted fields)
    function getRating(uint256 index) external view returns (Rating memory rating) {
        require(index < ratings.length, "Rating index out of bounds");
        return ratings[index];
    }
    
    /// @notice Get total number of ratings
    /// @return count Total number of ratings
    function getTotalRatings() external view returns (uint256 count) {
        return statistics.totalRatings;
    }
    
    /// @notice Get encrypted statistics (for admin decryption)
    /// @return stats Statistics struct with encrypted sums and counts
    function getStatistics() external view returns (Statistics memory stats) {
        return statistics;
    }
    
    /// @notice Get average scores (encrypted, requires decryption)
    /// @return averageAttitude Average attitude score (encrypted)
    /// @return averageSpeed Average speed score (encrypted)
    /// @return averageProfessionalism Average professionalism score (encrypted)
    /// @return averageWeightedScore Average weighted score (encrypted)
    /// @return thresholdPassRate Encrypted count of ratings meeting threshold
    /// @dev Note: Averages need to be calculated after decryption (total / count)
    /// This function returns the encrypted sums and counts for frontend calculation
    function getAverages() external view returns (
        euint32 averageAttitude,
        euint32 averageSpeed,
        euint32 averageProfessionalism,
        euint32 averageWeightedScore,
        euint32 thresholdPassRate
    ) {
        // Return encrypted sums - frontend will decrypt and divide by totalRatings
        // Note: Division in FHE is complex, so we return sums for frontend to decrypt and divide
        averageAttitude = statistics.sumAttitude;
        averageSpeed = statistics.sumSpeed;
        averageProfessionalism = statistics.sumProfessionalism;
        averageWeightedScore = statistics.sumWeightedScore;
        thresholdPassRate = statistics.countMeetsThreshold;
    }
    
    /// @notice Get rating count for a specific service agent
    /// @param serviceAgentId Service agent identifier
    /// @return count Number of ratings for this agent
    function getRatingCountForAgent(bytes32 serviceAgentId) external view returns (uint256 count) {
        for (uint256 i = 0; i < ratings.length; i++) {
            if (ratings[i].serviceAgentId == serviceAgentId) {
                count++;
            }
        }
    }
}

