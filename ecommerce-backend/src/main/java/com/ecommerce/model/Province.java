package com.ecommerce.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Document(collection = "provinces")
public class Province {
    @Id
    private String id;

    @Field("Type")
    private String type;

    @Field("Code")
    private String code;

    @Field("Name")
    private String name;

    @Field("NameEn")
    private String nameEn;

    @Field("FullName")
    private String fullName;

    @Field("FullNameEn")
    private String fullNameEn;

    @Field("CodeName")
    private String codeName;

    @Field("AdministrativeUnitId")
    private int administrativeUnitId;

    @Field("AdministrativeRegionId")
    private int administrativeRegionId;

    @Field("District")
    private List<District> district;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNameEn() {
        return nameEn;
    }

    public void setNameEn(String nameEn) {
        this.nameEn = nameEn;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getFullNameEn() {
        return fullNameEn;
    }

    public void setFullNameEn(String fullNameEn) {
        this.fullNameEn = fullNameEn;
    }

    public String getCodeName() {
        return codeName;
    }

    public void setCodeName(String codeName) {
        this.codeName = codeName;
    }

    public int getAdministrativeUnitId() {
        return administrativeUnitId;
    }

    public void setAdministrativeUnitId(int administrativeUnitId) {
        this.administrativeUnitId = administrativeUnitId;
    }

    public int getAdministrativeRegionId() {
        return administrativeRegionId;
    }

    public void setAdministrativeRegionId(int administrativeRegionId) {
        this.administrativeRegionId = administrativeRegionId;
    }

    public List<District> getDistrict() {
        return district;
    }

    public void setDistrict(List<District> district) {
        this.district = district;
    }
}

class District {
    @Field("Type")
    private String type;

    @Field("Code")
    private String code;

    @Field("Name")
    private String name;

    @Field("NameEn")
    private String nameEn;

    @Field("FullName")
    private String fullName;

    @Field("FullNameEn")
    private String fullNameEn;

    @Field("CodeName")
    private String codeName;

    @Field("ProvinceCode")
    private String provinceCode;

    @Field("AdministrativeUnitId")
    private int administrativeUnitId;

    @Field("Ward")
    private List<Ward> ward;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNameEn() {
        return nameEn;
    }

    public void setNameEn(String nameEn) {
        this.nameEn = nameEn;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getFullNameEn() {
        return fullNameEn;
    }

    public void setFullNameEn(String fullNameEn) {
        this.fullNameEn = fullNameEn;
    }

    public String getCodeName() {
        return codeName;
    }

    public void setCodeName(String codeName) {
        this.codeName = codeName;
    }

    public String getProvinceCode() {
        return provinceCode;
    }

    public void setProvinceCode(String provinceCode) {
        this.provinceCode = provinceCode;
    }

    public int getAdministrativeUnitId() {
        return administrativeUnitId;
    }

    public void setAdministrativeUnitId(int administrativeUnitId) {
        this.administrativeUnitId = administrativeUnitId;
    }

    public List<Ward> getWard() {
        return ward;
    }

    public void setWard(List<Ward> ward) {
        this.ward = ward;
    }
}

class Ward {
    @Field("Type")
    private String type;

    @Field("Code")
    private String code;

    @Field("Name")
    private String name;

    @Field("NameEn")
    private String nameEn;

    @Field("FullName")
    private String fullName;

    @Field("FullNameEn")
    private String fullNameEn;

    @Field("CodeName")
    private String codeName;

    @Field("DistrictCode")
    private String districtCode;

    @Field("AdministrativeUnitId")
    private int administrativeUnitId;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNameEn() {
        return nameEn;
    }

    public void setNameEn(String nameEn) {
        this.nameEn = nameEn;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getFullNameEn() {
        return fullNameEn;
    }

    public void setFullNameEn(String fullNameEn) {
        this.fullNameEn = fullNameEn;
    }

    public String getCodeName() {
        return codeName;
    }

    public void setCodeName(String codeName) {
        this.codeName = codeName;
    }

    public String getDistrictCode() {
        return districtCode;
    }

    public void setDistrictCode(String districtCode) {
        this.districtCode = districtCode;
    }

    public int getAdministrativeUnitId() {
        return administrativeUnitId;
    }

    public void setAdministrativeUnitId(int administrativeUnitId) {
        this.administrativeUnitId = administrativeUnitId;
    }
}