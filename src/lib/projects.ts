import projectDocuments from "@/content/projects.json";
import {
  applyProjectContentOverrides,
  type ProjectContentBlock,
} from "@/lib/project-content-overrides";

export type LocalProject = {
  id: string;
  projectTitle: string;
  projectSlug: string;
  blocks: ProjectContentBlock[];
};

const projects = projectDocuments as LocalProject[];

export function getProjects(): LocalProject[] {
  return projects.map((project) => ({
    ...project,
    blocks: applyProjectContentOverrides(project.projectSlug, project.blocks),
  }));
}

export function getProjectBySlug(slug: string): LocalProject | undefined {
  return getProjects().find((project) => project.projectSlug === slug);
}
