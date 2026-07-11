package com.blood.backend.donors;

import com.blood.backend.common.BloodGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DonorProfileRepository extends JpaRepository<DonorProfile, Long> {
    Optional<DonorProfile> findByUserId(Long userId);

    @Query("""
            select dp from DonorProfile dp
            where (:bloodGroup is null or dp.bloodGroup = :bloodGroup)
              and (:location is null or lower(dp.location) like lower(concat('%', :location, '%')))
              and (:availability is null or dp.availability = :availability)
            """)
    List<DonorProfile> search(
            @Param("bloodGroup") BloodGroup bloodGroup,
            @Param("location") String location,
            @Param("availability") Boolean availability
    );
}

