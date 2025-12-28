export async function signUp(email: string, password: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`signIn(email=${email}, password=${password})`);
}

export async function signIn(email: string, password: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`signIn(email=${email}, password=${password})`);
}
