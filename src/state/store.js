import { createEntityStore, createEntityQuery } from '@datorama/akita';
import axios from 'axios';
import { map } from 'rxjs';

// Create an initial state
const initialState = {
  data: [],
  loading: false,
  error: false,
};

// Create an entity store
export const dataStore = createEntityStore(initialState, {
  name: 'data',
  idKey: 'id',
});
export const dataQuery = createEntityQuery(dataStore);

export const dataState$ = dataQuery
  .select()
  .pipe(
    map((state) =>
      state.loading
        ? 'loading'
        : state.error
        ? 'error'
        : state.ids.length
        ? 'success'
        : 'empty'
    )
  );

// Fetch data and update the store
export async function fetchData() {
  dataStore.update({ loading: true, error: false });
  try {
    const response = await axios.get('/getMatches');
    dataStore.set(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    dataStore.update({ error: true, loading: false });
  }
  dataStore.update({ loading: false });
}

export async function deletePolicy(id) {
  try {
    const response = axios.delete(`/delete/${id}`);

    // Removing from the store doesn't rerender the list, updating does so it's needed here
    dataStore.update(id, response.data);
    dataStore.remove(id);
    return response.data;
  } catch (error) {
    console.error('Unable to delete policy:');
    console.error(error);
  }
}

export const dataObservable = dataQuery.select();
