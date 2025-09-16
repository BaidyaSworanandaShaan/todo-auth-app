import * as Yup from "yup";

export const TodoSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string(),
  project_id: Yup.number()
    .typeError("Project is required")
    .required("Project is required"),
  status_id: Yup.number()
    .typeError("Status is required")
    .required("Status is required"),
  due_date: Yup.date()
    .required("Due date is required")
    .min(new Date(), "Due date cannot be in the past"),
  priority: Yup.number()
    .min(1, "Priority must be at least 1")
    .max(5, "Priority cannot be more than 5")
    .nullable(),
  tags: Yup.string(), // optional, comma-separated
});
