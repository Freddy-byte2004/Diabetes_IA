 import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';


 function Barra({glucosa, insulina, bmi}){
    const data = [
  { name: 'Glucosa', Usuario: glucosa, Promedio: 100 },
  { name: 'Insulina', Usuario: insulina, Promedio: 75 },
  { name: 'BMI', Usuario: bmi, Promedio: 25 },
];
    return(
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
             <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    
                    data={data}
                    margin={{ top: 130, right: 30, left: 30, bottom: 20 }}
                    >
                    <XAxis dataKey="name" type="category" />
                    <YAxis  />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Usuario" fill="#4940e7ff" />
                    <Bar dataKey="Promedio" fill="#82ca9d" />
                 </BarChart>
  </ResponsiveContainer>
  </div>




    )
 }

 export {Barra};