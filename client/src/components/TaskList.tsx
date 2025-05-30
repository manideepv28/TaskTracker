import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Task } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Check, Clock, CheckCircle, Trash2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const toggleTaskMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
      await apiRequest('PATCH', `/api/tasks/${id}`, { completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to delete task",
        variant: "destructive",
      });
    },
  });

  const handleToggleTask = (task: Task) => {
    toggleTaskMutation.mutate({ id: task.id, completed: !task.completed });
  };

  const handleDeleteTask = (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTaskMutation.mutate(id);
    }
  };

  const formatTimeAgo = (date: string | Date) => {
    const now = new Date();
    const taskDate = new Date(date);
    const diffInMs = now.getTime() - taskDate.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return 'just now';
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl text-slate-300 mb-4">
          <FileText className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-xl font-medium text-slate-600 mb-2">No tasks yet</h3>
        <p className="text-slate-500 mb-6">Get started by adding your first task</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div 
          key={task.id}
          className={`bg-white rounded-lg shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow ${
            task.completed ? 'opacity-75' : ''
          }`}
        >
          <div className="flex items-start space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className={`mt-1 w-5 h-5 rounded border-2 p-0 ${
                task.completed 
                  ? 'border-green-600 bg-green-600 text-white hover:bg-green-700' 
                  : 'border-slate-300 hover:border-blue-600'
              }`}
              onClick={() => handleToggleTask(task)}
              disabled={toggleTaskMutation.isPending}
            >
              {task.completed && <Check className="w-3 h-3" />}
            </Button>
            
            <div className="flex-1 min-w-0">
              <h3 className={`text-lg font-medium text-slate-800 ${
                task.completed ? 'line-through' : ''
              }`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`text-sm text-slate-500 mt-1 ${
                  task.completed ? 'line-through' : ''
                }`}>
                  {task.description}
                </p>
              )}
              <div className="flex items-center mt-2 text-xs text-slate-400">
                {task.completed ? (
                  <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
                ) : (
                  <Clock className="w-3 h-3 mr-1" />
                )}
                <span>
                  {task.completed ? 'Completed' : 'Created'} {formatTimeAgo(task.createdAt)}
                </span>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-red-500 p-1"
              onClick={() => handleDeleteTask(task.id)}
              disabled={deleteTaskMutation.isPending}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
