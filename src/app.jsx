// App.js

import Timeline from "./components/Timeline";

const sampleVideos = [
  {
    id: '1',
    name: '1',
    start: '2025-02-23T03:30:00',
    end: '2025-02-23T04:10:00',
  },
  {
    id: '2',
    name: '2',
    start: '2025-02-23T09:00:00',
    end: '2025-02-23T09:50:00',
  },
  {
    id: '3',
    name: '3',
    start: '2025-02-23T06:15:00',
    end: '2025-02-23T06:45:00',
  },
];

export default function App() {
  return (
    <div class="p-4 border w-[70%] mx-auto mt-10">
      <h1 class="text-xl font-bold mb-4">Video Timeline</h1>
      <Timeline videos={sampleVideos} />
    </div>
  );
}
