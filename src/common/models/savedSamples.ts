import { initStoredSamples } from '@flumens';
import { modelStore } from './store';
import Sample from './sample';

console.log('SavedSamples: initializing');
const savedSamples = initStoredSamples(modelStore, Sample);

export default savedSamples;
