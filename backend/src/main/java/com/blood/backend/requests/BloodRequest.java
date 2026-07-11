package com.blood.backend.requests;

import com.blood.backend.common.RequestStatus;
import com.blood.backend.users.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "blood_requests", indexes = {
        @Index(name = "idx_requests_donor_status", columnList = "donor_user_id, status"),
        @Index(name = "idx_requests_receiver_status", columnList = "receiver_user_id, status")
})
public class BloodRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "receiver_user_id", nullable = false)
    private User receiver;

    @ManyToOne(optional = false)
    @JoinColumn(name = "donor_user_id", nullable = false)
    private User donor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status = RequestStatus.PENDING;

    @Column(name = "requested_at", nullable = false, updatable = false)
    private Instant requestedAt = Instant.now();

    @Column(name = "responded_at")
    private Instant respondedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @Column(name = "note")
    private String note;
}

