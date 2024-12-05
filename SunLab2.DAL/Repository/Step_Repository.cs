using SunLab2.DAL.Interfaces;
using SunLab2.DAL.Model;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SunLab2.DAL.Repository
{
    public class Step_Repository : IStep
    {
        public bool Add_Step(Step step)
        {
            try
            {
                using (ApplicationContext db = new ApplicationContext())
                {
                    db.Steps.Add(step);
                    db.SaveChanges();
                }

                Debug.WriteLine($"Successful addition of a step: {step.StepsNum} on day {step.Day + 1}");
                return true;
            }
            catch (Exception ex)
            {
                var innerException = ex.InnerException;
                Debug.WriteLine(innerException.Message);
                Debug.WriteLine($"Error addition of a step: {step.StepsNum} on day {step.Day + 1}");
                return false;
            }
        }

        public bool Update_Step(int stepID, int newSteps)
        {
            try
            {
                using (ApplicationContext db = new ApplicationContext())
                {
                    var updateStep = db.Steps.FirstOrDefault(u => u.StepID == stepID);

                    if (updateStep != null)
                    {
                        updateStep.StepsNum = newSteps;
                        db.SaveChanges();
                    }

                    Debug.WriteLine($"Successful updating of a step on: {newSteps}");
                    return true;
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                Debug.WriteLine($"Error updating of a step on {newSteps}");
                return false;
            }
        }
    }
}
