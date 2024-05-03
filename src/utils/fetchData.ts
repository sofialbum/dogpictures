type Method = "GET" | "POST";

interface Options {
  url: string;
  method: Method;
  body?: any;
}

interface FetchConfig {
  method: Method,
   headers: any,
    body?: any
  }

const fetchDataFromApi = async ({url, method, body}: Options): Promise<any> => {
  const config: FetchConfig = {
    method: method,
    headers: { "Content-Type": "application/json" },
  }

  if (body){
    config.body = JSON.stringify(body)
  }

  const res = await fetch(url, config);

  const data = await res.json();
  return data;
};

export default fetchDataFromApi;
