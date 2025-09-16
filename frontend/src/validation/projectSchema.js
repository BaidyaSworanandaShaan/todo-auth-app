import * as Yup from "Yup";

export const ProjectSchema = Yup.object({
  name: Yup.string().required("Project's Name is required"),
});
