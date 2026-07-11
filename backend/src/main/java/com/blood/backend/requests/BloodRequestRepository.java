package com.blood.backend.requests;

import com.blood.backend.common.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {
    List<BloodRequest> findByDonorIdOrderByRequestedAtDesc(Long donorUserId);
    List<BloodRequest> findByReceiverIdOrderByRequestedAtDesc(Long receiverUserId);

    Optional<BloodRequest> findByIdAndDonorId(Long id, Long donorUserId);
    Optional<BloodRequest> findByIdAndReceiverId(Long id, Long receiverUserId);

    boolean existsByReceiverIdAndDonorIdAndStatus(Long receiverUserId, Long donorUserId, RequestStatus status);
}

