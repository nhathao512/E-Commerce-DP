package com.ecommerce.controller;

import com.ecommerce.model.Province;
import com.ecommerce.repository.ProvinceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/provinces")
public class ProvinceController {
    @Autowired
    private ProvinceRepository provinceRepository;

    @GetMapping
    public List<Province> getProvinces() {
        return provinceRepository.findAll();
    }
}