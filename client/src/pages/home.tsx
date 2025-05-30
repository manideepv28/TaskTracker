import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Task } from "@shared/schema";
import TaskList from "@/components/TaskList";
import AddTaskModal from "@/components/AddTaskModal";
import TaskFilters from "@/components/TaskFilters";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ['/api/tasks'],
  });

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-800">TaskFlow</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-500">
                {completedCount} of {totalCount} completed
              </span>
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="bg-primary hover:bg-blue-700 text-white font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <TaskFilters 
          currentFilter={filter} 
          onFilterChange={setFilter} 
        />
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-slate-500">Loading tasks...</div>
          </div>
        ) : (
          <TaskList tasks={filteredTasks} />
        )}
      </main>

      {/* Mobile Floating Action Button */}
      <Button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-primary hover:bg-blue-700 text-white w-14 h-14 rounded-full shadow-lg hover:scale-110 transition-all md:hidden p-0"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Add Task Modal */}
      <AddTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
