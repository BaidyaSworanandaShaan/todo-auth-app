// SingleTodo.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import TodoItem from "../../../components/TodoItem";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const SingleTodo = () => {
  const { id } = useParams();
  const [todo, setTodo] = useState(null);
  const { accessToken } = useAuth();
  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/todos/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });
        console.log(res);
        setTodo(res.data.todo);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTodo();
  }, [id]);

  if (!todo) return <p>Loading...</p>;

  return (
    <div className="p-10 mx-4 md:mx-10">
      <div className="p-4 border">
        <TodoItem todo={todo} setTodos={setTodo} />
      </div>
    </div>
  );
};

export default SingleTodo;
