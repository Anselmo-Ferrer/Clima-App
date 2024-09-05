import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './components/ui/card';
import { Input } from './components/ui/input';

interface Waether {
  description: string
  icon: string;
}

interface Main {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
}

interface CityData {
  name: string;
  id: number;
  weather: Waether[];
  main: Main;
  // Adicione outras propriedades aqui, conforme necessário
}

export default function App() {
  const [cityData, setCityData] = useState<CityData | null>(null);
  const [city, setCity] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);

  async function api(city: string) { 
    try {
    const key = import.meta.env.VITE_API_KEY
    const resultado = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric&lang=pt_br`);
    const dados = await resultado.json();

    if (dados.cod !== 200) {
      throw new Error(dados.message);
    }
    setIsVisible(true)
    console.log(dados);
    setCityData(dados);
    }
    catch (error) {
      console.log(error);
      setCityData(null);
      setIsVisible(false);
    }


  }

  useEffect(() => {
    console.log('api carregada')
  }, []);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCity(e.target.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    api(city);
  }

  return (
      <div className='w-full h-screen flex justify-center items-center'>
        <Card className="w-[350px] h-[500px] rounded-md">
          <CardHeader>
            <CardTitle>Climapp</CardTitle>
            <CardDescription>Digite o nome da cidade para saber mais</CardDescription>
          </CardHeader>
          <CardContent className='border-b-2 mb-5'>
          <form onSubmit={handleSubmit}>
            <Input
              placeholder="Pesquise a cidade"
              value={city}
              onChange={handleInputChange}
            />
          </form>
          </CardContent>
          <CardFooter className={`flex flex-col ${isVisible ? '' : 'hidden'}`}>
            <div className='flex justify-center flex-col items-center' id='cidade'>
              <span id='titleCityName' className='text-5xl'>
              {cityData ? cityData.name : ''}
              </span>
              <span>
                {cityData? cityData.weather.map(d => d.description) : ''}
              </span>
            </div>
            <div id='temperatura' className='p-10'>
              <span className='text-6xl'>
                {cityData? `${cityData.main.temp.toFixed(0)}º` : ''}
              </span>
            </div>
            <div id='subs' className='gap-10 flex'>
              <div className='flex-col flex items-center'>
                <span className='text-md'>Máxima</span>
                <span className='text-3xl'>
                  {cityData? `${cityData.main.temp_max.toFixed(0)}º` : ''}
                </span>
              </div>
              <div className='flex-col flex items-center'>
                <span className='text-md'>Mínima</span>
                <span className='text-3xl'>
                  {cityData? `${cityData.main.temp_min.toFixed(0)}º` : ''}
                </span>
              </div>
                <div className='flex-col flex items-center'>
                <span className='text-md'>Sensação</span>
                <span className='text-3xl'>
                  {cityData? `${cityData.main.feels_like.toFixed(0)}º` : ''}
                </span>
              </div>
            </div>
          </CardFooter>
            
        </Card>
      </div>
  );
}
