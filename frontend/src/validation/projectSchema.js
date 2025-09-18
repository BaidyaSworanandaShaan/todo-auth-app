import * as Yup from "yup";

export const ProjectSchema = Yup.object({
  name: Yup.string().required("Project's Name is required"),
});
