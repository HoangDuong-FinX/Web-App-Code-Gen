import type { Buyer } from "../types";

type LoginOutcome = "success" | "fail" | "locked";
let loginOutcome: LoginOutcome = "success";

export function setLoginOutcome(outcome: LoginOutcome): void {
  loginOutcome = outcome;
}

type RegisterOutcome = "success" | "fail";
let registerOutcome: RegisterOutcome = "success";

export function setRegisterOutcome(outcome: RegisterOutcome): void {
  registerOutcome = outcome;
}

export function simulateLogin(
  _identity: string,
  _password: string,
): Promise<{ success: boolean; locked: boolean; buyer: Buyer | null }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (loginOutcome === "locked") {
        resolve({ success: false, locked: true, buyer: null });
      } else if (loginOutcome === "fail") {
        resolve({ success: false, locked: false, buyer: null });
      } else {
        resolve({
          success: true,
          locked: false,
          buyer: {
            id: "buyer-001",
            name: "Nguy\u1ec5n V\u0103n An",
            phone: "0901234567",
            email: "an.nguyen@email.com",
          },
        });
      }
    }, 800);
  });
}

export function simulateRegister(
  _name: string,
  _phone: string,
  _email: string,
  _password: string,
): Promise<{ success: boolean }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: registerOutcome === "success" });
    }, 800);
  });
}
