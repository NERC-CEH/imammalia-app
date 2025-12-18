import { SampleCollection } from '@flumens';
import Sample from '../sample';
import { samplesStore } from '../store';

console.log('SavedSamples: initializing');
const samples: SampleCollection<Sample> = new SampleCollection({
  store: samplesStore,
  Model: Sample,
}) as any;

// eslint-disable-next-line
export async function uploadAllSamples(toast: any) {
  console.log('SavedSamples: uploading all.');
  const getUploadPromise = (s: Sample) =>
    !s.isUploaded && s.isStored && s.metadata.saved && s.upload();

  const processError = (err: any) => {
    if (err.isHandled) return;
    toast.error(err);
  };
  await Promise.all(samples.map(getUploadPromise)).catch(processError);

  console.log('SavedSamples: all records were uploaded!');
}

export function getPending() {
  const byUploadStatus = (sample: Sample) => !sample.syncedAt;

  return samples.filter(byUploadStatus);
}

export default samples;
