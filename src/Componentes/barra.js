import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Barra({ glucosa, insulina, bmi }) {
  const data = [
    { name: 'Glucosa', Usuario: glucosa, "Maximo saludable": 100 },
    { name: 'Insulina', Usuario: insulina, "Maximo saludable": 25 },
    { name: 'BMI', Usuario: bmi, "Maximo saludable": 24.9 },
  ];

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 18, right: 20, left: 10, bottom: 42 }}>
          <XAxis
            dataKey="name"
            type="category"
            interval={0}
            tickMargin={10}
            tick={{ fontSize: 12, fill: '#1f4f74' }}
          />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="bottom" align="center" height={28} wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="Usuario" fill="#4940e7ff" />
          <Bar dataKey="Maximo saludable" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export { Barra };
