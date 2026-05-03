export default function CreateTask({
  title,
  setTitle,
  description,
  setDescription,
  assignedTo,
  setAssignedTo,
  members,
  onCreate,
}: any) {
  return (
    <div className="create-task">
      <h2>Create Task</h2>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select
        value={assignedTo}
        onChange={(e) => setAssignedTo(e.target.value)}
      >
        <option value="">Unassigned</option>
        {members.map((m: any) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>

      <button onClick={onCreate}>Create Task</button>
    </div>
  );
}