import { createEntityStore, createEntityQuery } from "@datorama/akita";
import axios from "axios";

// Create an initial state
const initialState = {
  data: [],
  loading: false,
  error: false,
};

// Create an entity store
const dataStore = createEntityStore(initialState, { name: "data" });
const dataQuery = createEntityQuery(dataStore);

// Fetch data and update the store
const fetchData = async () => {
  dataStore.update({ loading: true, error: false });
  try {
    const response = await axios.get("/getMatches");
    dataStore.set(response.data);
    dataStore.update({ data: response.data, loading: false });
  } catch (error) {
    console.error("Error fetching data:", error);
    dataStore.update({ error: true, loading: false });
  }
};

const dataObservable = dataQuery.select();

export { dataObservable, fetchData };
