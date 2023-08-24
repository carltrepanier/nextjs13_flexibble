import { User, Session } from 'next-auth';

export type FormState = {
  title: string;
  description: string;
  image: string;
  webSiteUrl: string;
  githubUrl: string;
  category: string;
};

export interface ProjectInterface {
  id: string;
  image: string;
  title: string;
  description: string;
  webSiteUrl: string;
  githubUrl: string;
  category: string;
  createdBy: {
    name: string;
    email: string;
    avatarUrl: string;
    id: string;
  };
};

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  description: string | null;
  avatarUrl: string;
  githubUrl: string | null;
  linkedInUrl: string | null;
  projects: {
    edges: { node: ProjectInterface }[];
    pageInfo: {
      hasPreviousPage: boolean;
      hasNextPage: boolean;
      startCursor: string;
      endCursor: string;
    };
  };
};

export interface SessionInterface extends Session {
  user: User & {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
  };
};

export interface ProjectForm {
  image: string;
  title: string;
  description: string;
  webSiteUrl: string;
  githubUrl: string;
  category: string;
};
