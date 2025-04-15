package com.ecommerce.repository;

import com.ecommerce.model.Province;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProvinceRepository extends MongoRepository<Province, String> {
}