import * as Yup from "Yup";

export const TodoSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string(),
  status: Yup.string()
    .oneOf(["pending", "completed"])
    .required("Status is required"),
});
