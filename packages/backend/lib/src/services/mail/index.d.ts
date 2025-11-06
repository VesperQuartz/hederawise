import { type Transporter } from "nodemailer";
interface IMailServer {
    sendVerificationEmail({ recipient, tokenUrl, }: {
        recipient: string;
        tokenUrl: string;
    }): Promise<boolean>;
}
export declare class MailServer implements IMailServer {
    #private;
    constructor(transporter: Transporter);
    sendVerificationEmail: ({ recipient, tokenUrl, }: {
        recipient: string;
        tokenUrl: string;
    }) => Promise<boolean>;
}
export {};
