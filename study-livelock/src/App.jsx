import { useState } from 'react'
import './App.css'
import { Button } from "../components/ui";
import { Card, CardContent } from "../components/ui";
import { motion } from "framer-motion";

function App() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <motion.h1
        className="text-4xl font-bold text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Livelock vs. Deadlock Simulation
      </motion.h1>

      <p className="text-center text-lg mb-8 max-w-3xl mx-auto">
        Explore how livelock and deadlock occur in operating systems through interactive visualizations and detailed explanations.
      </p>

      <div className="flex flex-wrap justify-center gap-6">
        <Button onClick={() => setShowInfo(!showInfo)}>Info</Button>
        <Button variant="secondary">Run Simulation</Button>
        <Button variant="outline">Show Code</Button>
      </div>

      {showInfo && (
        <motion.div
          className="mt-8 max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Key Differences</h2>
              <ul className="list-disc pl-6">
                <li>Deadlock: No context switches, processes are stuck.</li>
                <li>Livelock: Frequent context switches, but no progress.</li>
                <li>Deadlock occurs due to circular wait; livelock due to retry loops.</li>
                <li>Solutions: Deadlock prevention & livelock backoff mechanisms.</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

export default App
