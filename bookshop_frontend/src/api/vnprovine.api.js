export const getAllProvice = async () => {
  const response = await fetch(
    `https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1`
  );
  let data = await response.json();
  data = data.data.data;
  data = Array.isArray(data) ? data : [data];
  console.log(data);
  return data;
};
