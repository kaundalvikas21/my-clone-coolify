import { Hono } from 'hono';
import { handle } from 'hono/vercel';

import auth from "@/features/auth/server/route";
import members from "@/features/members/server/route"; 
import workspaces from "@/features/workspaces/server/route";
import projects from "@/features/projects/server/route";
import tasks from "@/features/tasks/server/route";

// Set to true to enable the route, false to disable
const enabledRoutes = {
  auth: true,
  members: true,
  workspaces: true,
  projects: true,
  tasks: true
};

const app = new Hono().basePath('/api');

// Only add routes that are enabled
if (enabledRoutes.auth) app.route("/auth", auth);
if (enabledRoutes.members) app.route("/members", members);
if (enabledRoutes.workspaces) app.route("/workspaces", workspaces);
if (enabledRoutes.projects) app.route("/projects", projects);
if (enabledRoutes.tasks) app.route("/tasks", tasks);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof app;