// returns true when we are running inside real lambda
export const isRunningInLambda = () => !!(process.env.LAMBDA_TASK_ROOT || false);

// get the state name
export const getStage = (context) => context.functionName.split('-')[1];
