async function getCoordinates(location) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    location
  )}&format=json&addressdetails=1&limit=1`;
  const response = await fetch(url, {
    headers: { "User-Agent": "MyApp/1.0" }, // Thêm User-Agent hợp lệ
  });
  const data = await response.json();

  if (data.length === 0) {
    throw new Error(`Không tìm thấy tọa độ cho địa điểm: ${location}`);
  }

  const { lat, lon } = data[0];
  return { lat: parseFloat(lat), lon: parseFloat(lon) };
}

async function getDrivingDistance(coord1, coord2) {
  const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${coord1.lon},${coord1.lat};${coord2.lon},${coord2.lat}?overview=full`;
  const response = await fetch(osrmUrl);
  const data = await response.json();

  if (data.routes.length === 0) {
    throw new Error("Không tính được khoảng cách giữa hai vị trí.");
  }

  return data.routes[0].distance / 1000; // Khoảng cách trả về theo mét -> đổi sang km
}

export const calculateDistance = async (
  location2,
  location1 = "Hưng Lợi, Ninh Kiều, Cần Thơ"
) => {
  try {
    // Lấy tọa độ hai địa điểm
    console.log(`Đang lấy tọa độ cho: ${location1}`);
    const coord1 = await getCoordinates(location1);
    console.log(`Tọa độ ${location1}:`, coord1);

    console.log(`Đang lấy tọa độ cho: ${location2}`);
    const coord2 = await getCoordinates(location2);
    console.log(`Tọa độ ${location2}:`, coord2);

    // Tính khoảng cách giữa hai tọa độ
    console.log("Đang tính khoảng cách...");
    const distance = await getDrivingDistance(coord1, coord2);
    console.log(
      `Khoảng cách từ ${location1} đến ${location2} là: ${distance.toFixed(
        2
      )} km`
    );

    return distance.toFixed(2);
  } catch (error) {
    console.error("Lỗi:", error.message);
  }
};

export const calculateShippingFee = (
  distance,
  baseFee = 15000,
  baseDistance = 5,
  extraFeePerKm = 1000
) => {
  if (distance <= baseDistance) {
    return baseFee; // Trong khoảng cách cơ bản, chỉ tính phí cơ bản
  }

  const extraDistance = distance - baseDistance;
  const totalFee = baseFee + extraDistance * extraFeePerKm;
  return totalFee;
};
