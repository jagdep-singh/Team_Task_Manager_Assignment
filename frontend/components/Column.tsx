import TaskCard from "./TaskCard";

export default function Column({ title, tasks, onMove }: any) {
  return (
    <div className="column">
      <h2>{title}</h2>

      {tasks.map((task: any) => (
        <TaskCard key={task.id} task={task} onMove={onMove} />
      ))}
    </div>
  );
}