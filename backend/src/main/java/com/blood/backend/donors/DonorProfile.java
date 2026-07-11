package com.blood.backend.donors;

import com.blood.backend.common.BloodGroup;
import com.blood.backend.users.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "donor_profiles", indexes = {
        @Index(name = "idx_donors_blood_location_avail", columnList = "blood_group, location, availability")
})
public class DonorProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "blood_group", nullable = false)
    private BloodGroup bloodGroup;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private boolean availability = true;

    @Column(name = "last_donation_date")
    private LocalDate lastDonationDate;
}

