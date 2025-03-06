import { useState } from "react";
import "./App.css";
import { Button } from "../components/ui";
import { Card, CardContent } from "../components/ui";
import { motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

function App() {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [showCode, setShowCode] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const scenarios = [
    {
      title: "Scenario 1: High-Priority Preemption",
      info: "A low-priority process gets constantly preempted by a high-priority process, causing livelock.",
      description: (
        <div>
          <h2 className="text-xl font-bold text-blue-400">High-Priority Preemption - Livelock</h2>
          <p>
            In this scenario, a low-priority task gets repeatedly <strong>preempted</strong> by a high-priority task.
            The system keeps giving control to the high-priority task, preventing the low-priority task from making progress.
          </p>
          <h3 className="text-lg font-semibold mt-4">🛠 How This Happens</h3>
          <ul className="list-disc list-inside ml-4">
            <li>A low-priority process starts executing.</li>
            <li>A high-priority process arrives and preempts it.</li>
            <li>Before the low-priority process can resume, the high-priority process gets scheduled <strong>again</strong>.</li>
            <li>This cycle repeats indefinitely, leading to <strong>livelock</strong>.</li>
          </ul>
          <h3 className="text-lg font-semibold mt-4">🎯 Real-World Example</h3>
          <p>
            Imagine two people trying to pass through a doorway:
          </p>
          <ul className="list-disc list-inside ml-4">
            <li>The first person (low priority) steps forward.</li>
            <li>The second person (high priority) <strong>interrupts</strong> and moves forward instead.</li>
            <li>The first person tries again, but the second person <strong>keeps taking priority</strong>.</li>
            <li>This goes on forever, and neither moves forward effectively.</li>
          </ul>
          <h3 className="text-lg font-semibold mt-4">✅ Possible Solutions</h3>
          <ul className="list-disc list-inside ml-4">
            <li><strong>Priority Aging:</strong> Gradually increase the priority of waiting tasks.</li>
            <li><strong>Time-Slice Allocation:</strong> Restrict high-priority tasks from running indefinitely.</li>
            <li><strong>Fair Scheduling:</strong> Use algorithms like <strong>Round Robin</strong> to prevent starvation.</li>
          </ul>
        </div>
      ),
      code: {
        "Task.java": `
import java.util.concurrent.PriorityBlockingQueue;
import java.util.concurrent.atomic.AtomicBoolean;

public class Task implements Runnable, Comparable<Task> {
    private final String name;
    private final int priority;
    private final AtomicBoolean lowPriorityDone;
    private final int executionTime;

    public Task(String name, int priority, AtomicBoolean lowPriorityDone, int executionTime) {
        this.name = name;
        this.priority = priority;
        this.lowPriorityDone = lowPriorityDone;
        this.executionTime = executionTime;
    }

    // Getter for 'name'
    public String getName() {
        return name;
    }

    @Override
    public int compareTo(Task other) {
        return Integer.compare(other.priority, this.priority); // Higher priority first
    }

    @Override
    public void run() {
        if ("High Priority Task".equals(name)) {
            if (!lowPriorityDone.get()) {
                System.out.println(name + " preempting low-priority task! Can't proceed...");
                return;
            }
        }

        System.out.println(name + " is running...");
        try { Thread.sleep(executionTime); } catch (InterruptedException e) { }

        if ("Low Priority Task".equals(name)) {
            lowPriorityDone.set(true);
            System.out.println(name + " has completed!");
        }
    }
}`,
        "Main.java": `
import java.util.concurrent.PriorityBlockingQueue;
import java.util.concurrent.atomic.AtomicBoolean;

public class Main {
    public static void main(String[] args) {
        AtomicBoolean lowPriorityDone = new AtomicBoolean(false);
        PriorityBlockingQueue<Task> scheduler = new PriorityBlockingQueue<>();

        Task lowPriorityTask = new Task("Low Priority Task", 1, lowPriorityDone, 2000);
        Task highPriorityTask = new Task("High Priority Task", 2, lowPriorityDone, 500);

        scheduler.add(lowPriorityTask);
        scheduler.add(highPriorityTask);

        while (true) {
            Task nextTask = scheduler.poll();
            if (nextTask != null) {
                new Thread(nextTask).start();

                // Use the getter instead of direct access
                if (!lowPriorityDone.get() && "High Priority Task".equals(nextTask.getName())) {
                    scheduler.add(nextTask); // Requeue high-priority task
                }
            }

            try { Thread.sleep(300); } catch (InterruptedException e) { }
        }
    }
}`,
      },
    },
    {
      title: "Scenario 2: Circular Wait Deadlock",
      info: "Processes hold resources while waiting for others, causing deadlock.",
      code: {
        "Task.java": `public class Task {
    private final String name;

    public Task(String name) {
        this.name = name;
    }

    public synchronized void execute(Task other) {
        System.out.println(name + " is waiting for " + other.name);
        other.process();
    }

    public synchronized void process() {
        System.out.println(name + " is executing.");
    }
}`,
        "Main.java": `public class Main {
    public static void main(String[] args) {
        Task taskA = new Task("Task A");
        Task taskB = new Task("Task B");
        
        new Thread(() -> taskA.execute(taskB)).start();
        new Thread(() -> taskB.execute(taskA)).start();
    }
}`,
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <motion.h1
        className="text-4xl font-bold text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Livelock vs. Deadlock Simulation
      </motion.h1>

      <p className="text-center text-lg mb-8 max-w-[80%] mx-auto">
        Explore how livelock and deadlock occur in operating systems through interactive visualizations and detailed explanations.
      </p>

      <div className="flex flex-wrap justify-center gap-6">
        {scenarios.map((scenario, index) => (
          <Button key={index} onClick={() => {
            setSelectedScenario(index);
            setShowCode(false);
            setShowInfo(false);
          }}>
            {scenario.title}
          </Button>
        ))}
      </div>

      {selectedScenario !== null && (
        <motion.div
          className="mt-8 max-w-[80%] mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Card>
            <CardContent>
              <h2 className="text-2xl font-semibold mb-4">
                {scenarios[selectedScenario].title}
              </h2>
              <p className="mb-4">{scenarios[selectedScenario].info}</p>
              <div className="flex gap-4">
                <Button variant="primary" onClick={() => {
                  setShowInfo(!showInfo);
                  setShowCode(false);
                }}>
                  {showInfo ? "Hide Info" : "Show Info"}
                </Button>
                <Button variant="secondary">Run Simulation</Button>
                <Button variant="outline" onClick={() => {
                  setShowCode(!showCode);
                  setShowInfo(false);
                }}>
                  {showCode ? "Hide Code" : "Show Code"}
                </Button>
              </div>

              {/* Show Info Section */}
              {showInfo && (
                <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                    {scenarios[selectedScenario].description}
                </div>
              )}

              {/* Show Code Section */}
              {showCode && (
                <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                  {Object.entries(scenarios[selectedScenario].code).map(([filename, code], i) => (
                    <div key={i} className="mb-6">
                      <h3 className="text-lg font-semibold text-blue-400">{filename}</h3>
                      <SyntaxHighlighter language="java" style={dracula} showLineNumbers>
                        {code}
                      </SyntaxHighlighter>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

export default App;
