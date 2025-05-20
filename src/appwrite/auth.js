import config from "../config/config";
import { Client, Account, ID } from "appwrite";



export class AuthService {
    client = new Client();
    account;
    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);
        this.account = new Account(this.client);
    }

    async createAccount({email, password, name}) {
        try {
            const user = await this.account.create(ID.unique(), email, password, name);
            return this.login({email, password});
        } catch (error) {
            console.error("Error creating account:", error);
            throw error;
        }
    }

    async login({email, password}) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
           
        } catch (error) {
            console.error("Error logging in:", error);
            throw error;
        }
    }


    async currentUser() {
        try {
            const user = await this.account.get();
            return user;
        } catch (error) {
            console.error("Error getting current user:", error);
            throw error;
        }
    }  

    async logout() {
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.error("Error logging out:", error);
            throw error;
        }
    }


}  

const authService = new AuthService();
 
export default authService; 