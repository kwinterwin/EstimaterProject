export function getProfit() {
    //eslint-disable-next-line
    // debugger
    window.projectSalary = 0;
    window.othersMoney = 0;
    window.releasedProfit = 0;
    window.clearProfit = 0;
    let phases = window.project.phases;
    let roles = window.roles;
    let settings = window.settings;
    //заработная плата по проекту projectProfit projectSalary
    let projectSalary = 0;
    Object.values(window.project.tasks).forEach((phaseTasksArray) => {
        let phaseSum = phaseTasksArray.reduce((sum, task) => {
            let executor = roles.find((role) => role.id === task.executorId);
            return sum + parseFloat(parseFloat(executor.salaryHour) * ((parseFloat(task.maxHours) + parseFloat(task.minHours)) / 2));
        }, 0);
        let phase = phases[phaseTasksArray[0].phaseId];
        phaseSum = phaseSum * (((Number(phase.generalQAPercentage) + Number(phase.generalPMPercentage) + Number(phase.generalBugsPercentage)) / 100) || 1);
        projectSalary += phaseSum;
    });
    window.projectSalary = parseFloat(projectSalary.toFixed(2));
    window.profitIsCounted = projectSalary ? true : false;
    //дополнительная зп по проекту additionalProjectSalary
    let additionalOrgSalary = settings.find(item => item.key === 'additSalaryOrg');
    let baseOrgSalary = settings.find(item => item.key === 'baseSalaryOrg');
    let additionalSalaryNormative = additionalOrgSalary.value / baseOrgSalary.value * 100;
    let additionalProjectSalary = projectSalary * additionalSalaryNormative / 100;
    // ФСЗН
    let fsznMoney = (projectSalary + additionalProjectSalary) * 9 / 100;
    //стоимость дополнительных штук
    let othersMoney = window.project.others ? window.project.others.reduce((sum, item) => {
        return sum + parseFloat(item.cost);
    }, 0) : 0;
    window.othersMoney = parseFloat(othersMoney.toFixed(2));
    //ПЗИ
    let pz = settings.find(item => item.key === 'pz');
    let pzNormative = pz.value / baseOrgSalary.value * 100;
    let pzi = projectSalary * pzNormative / 100;
    //прибыль с проекта
    let clearProjectProfit = projectSalary + additionalProjectSalary + fsznMoney + othersMoney + pzi;
    window.clearProfit = parseFloat(clearProjectProfit.toFixed(2));
    //прибыль от реализации
    let releasedProjectProfit = window.project.profitability * parseFloat(clearProjectProfit) / 100;
    window.releasedProfit = parseFloat((releasedProjectProfit + clearProjectProfit).toFixed(2));
}