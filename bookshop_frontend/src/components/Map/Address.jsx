import { Flex, Input, Select, Skeleton } from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// API fetch all provinces
export const getAllProvice = async () => {
  const response = await fetch(
    `https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1`
  );
  let data = await response.json();
  return data.data.data || []; // Return provinces data
};

const AddressComponent = ({ sendData }) => {
  const [loading, setLoading] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setselectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [detail, setDetail] = useState("");
  const [address, setAddress] = useState({
    province: "",
    district: "",
    ward: "",
    detail: "",
  });
  const user = useSelector((state) => state.auth?.user);

  // Fetch province data
  useEffect(() => {
    const fetchProvince = async () => {
      setLoading(true);
      try {
        const data = await getAllProvice();
        setProvinces(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProvince();
  }, []);

  // Fetch districts based on selected province
  useEffect(() => {
    setSelectedDistrict(null);
    setSelectedWard(null);
    const fetchDistrict = async (provinceCode) => {
      setLoading(true);
      setDistricts([]); // Reset districts when province changes
      setSelectedWard(null); // Reset selected ward when province changes
      try {
        const response = await fetch(
          `https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${provinceCode}&limit=-1`
        );
        const data = await response.json();
        setDistricts(data.data.data || []);
      } catch (error) {
        console.error("Error fetching districts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedProvince) {
      fetchDistrict(selectedProvince);
    } else {
      setDistricts([]);
    }
  }, [selectedProvince]);

  // Fetch wards based on selected district
  useEffect(() => {
    setSelectedWard(null);
    const fetchWards = async (districtCode) => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://vn-public-apis.fpo.vn/wards/getByDistrict?districtCode=${districtCode}&limit=-1`
        );
        const data = await response.json();
        setWards(data.data.data || []);
      } catch (error) {
        console.error("Error fetching wards:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedDistrict) {
      fetchWards(selectedDistrict);
    } else {
      setWards([]);
    }
  }, [selectedDistrict]);

  // Synchronize address when province, district, ward, or detail changes
  useEffect(() => {
    setAddress({
      province: selectedProvince
        ? provinces.find((p) => p.code === selectedProvince)?.name
        : "",
      district: selectedDistrict
        ? districts.find((d) => d.code === selectedDistrict)?.name
        : "",
      ward: selectedWard
        ? wards.find((w) => w.code === selectedWard)?.name
        : "",
      detail: detail,
    });
  }, [
    selectedProvince,
    selectedDistrict,
    selectedWard,
    detail,
    provinces,
    districts,
    wards,
  ]);

  // Send data when address changes
  useEffect(() => {
    sendData(address); // Send address data whenever it changes
  }, [address, sendData]);

  // Synchronize selectedProvince, selectedDistrict, and selectedWard from user.address when available
  useEffect(() => {
    if (user?.address) {
      // Ensure we only update once
      if (!selectedProvince) {
        const matchedProvince = provinces.find(
          (p) => p.name === user.address.province
        );
        if (matchedProvince) {
          setselectedProvince(matchedProvince.code);
        }
      }

      if (!selectedDistrict) {
        const matchedDistrict = districts.find(
          (d) => d.name === user.address.district
        );
        if (matchedDistrict) {
          setSelectedDistrict(matchedDistrict.code);
        }
      }

      if (!selectedWard) {
        const matchedWard = wards.find((w) => w.name === user.address.ward);
        if (matchedWard) {
          setSelectedWard(matchedWard.code);
        }
      }

      if (!detail && user.address.detail) {
        setDetail(user.address.detail); // Update detail if not already set
      }
    }
  }, [
    user?.address,
    selectedWard,
    selectedProvince,
    selectedDistrict,
    provinces,
    districts,
    wards,
  ]);

  return (
    <div>
      {loading ? (
        <div>
          <Skeleton.Input active style={{ width: "70%" }} />
          <Skeleton.Input active style={{ width: "70%" }} />
          <Skeleton.Input active style={{ width: "70%" }} />
          <Skeleton.Input active style={{ width: "70%" }} />
        </div>
      ) : (
        <div>
          <Flex justify="space-between">
            <label>Tỉnh/Thành Phố:</label>
            <Select
              style={{ width: "70%" }}
              placeholder="Chọn Tỉnh/Thành Phố"
              onChange={setselectedProvince}
              value={selectedProvince}
            >
              {provinces.map((province) => (
                <Select.Option key={province._id} value={province.code}>
                  {province.name}
                </Select.Option>
              ))}
            </Select>
          </Flex>

          <Flex justify="space-between" style={{ marginTop: "10px" }}>
            <label>Quận/Huyện</label>
            <Select
              style={{ width: "70%" }}
              placeholder="Chọn Quận/Huyện"
              onChange={setSelectedDistrict}
              value={selectedDistrict}
            >
              {districts.map((district) => (
                <Select.Option key={district._id} value={district.code}>
                  {district.name}
                </Select.Option>
              ))}
            </Select>
          </Flex>

          <Flex justify="space-between" style={{ marginTop: "10px" }}>
            <label>Phường/Xã</label>
            <Select
              style={{ width: "70%" }}
              placeholder="Chọn Phường/Xã"
              value={selectedWard}
              onChange={setSelectedWard}
            >
              {wards.map((ward) => (
                <Select.Option key={ward._id} value={ward.code}>
                  {ward.name}
                </Select.Option>
              ))}
            </Select>
          </Flex>

          <Flex justify="space-between" style={{ marginTop: "10px" }}>
            <label>Địa chỉ nhận hàng</label>
            <Input
              style={{ width: "70%" }}
              placeholder="Nhập địa chỉ nhận hàng"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
            />
          </Flex>
        </div>
      )}
    </div>
  );
};

AddressComponent.propTypes = {
  sendData: PropTypes.func.isRequired,
};

export default AddressComponent;
