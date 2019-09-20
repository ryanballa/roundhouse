type RailCarsType = Array<{
  id: number;
  road: number;
}>;

type TasksType = Array<{
  id: number;
  railcar_id: number;
}>;

const filteredRailcars = (tasksVals: TasksType, railcarsVals: RailCarsType) => {
  // Count railcar use
  const railcarsUse = [];
  tasksVals.map(task => {
    if (
      railcarsUse.reduce((res, rc) => res + (rc === task.railcar_id), 0) <= 1
    ) {
      railcarsUse.push(task.railcar_id);
    }
  });
  // Find only railcars not used or used once
  return railcarsVals.reduce((result, railcar) => {
    if (railcarsUse.reduce((res, rc) => res + (rc === railcar.id), 0) <= 1) {
      result.push(railcar);
    }
    return result;
  }, []);
};

export default filteredRailcars;
