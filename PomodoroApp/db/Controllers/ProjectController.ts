import { useGlobalContext } from "@/context/AppContext";
import Realm from "realm";
import {User} from "../models/User";
import { Project } from "../models/Project";





const createProjectController = (user: User | null, realm: Realm | null) => {
    const getDefaultProjectId = () => {
        if (realm && user) {
            const project_id = user.projects.find(project => project.name === "No Project")?._id;
            return project_id ? project_id : new Realm.BSON.ObjectId(0);
        } else {
            return new Realm.BSON.ObjectId(0);
        }
    };

    const getProjectList = () => {
        if (!realm || !user) {
            return [];
        }
        return Array.from(user.projects);
    };

    const addProject = (name: string) => {
        if (!realm || !user) {
            return { status: "error", message: "Missing user or realm" };
        }

        try {
            realm.write(() => {
                const newProject = realm.create<Project>('Project', Project.generate(name));
                user.projects.push(newProject);
            });
            return { status: "success", message: "Project added successfully" };
        } catch (error) {
            console.error("Error adding project:", error);
            return { status: "error", message: "Failed to add project" };
        }
    };

    

    return { getDefaultProjectId, addProject , getProjectList};
};

export { createProjectController };




