import { collection, getDocs, query, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Head } from '~/components/shared/Head';
import { useFirestore } from '~/lib/firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Page404 from './404';
import ToolCard from '../shared/ToolCard';

type Tool = {
  id: string,
  title: string,
  description: string,
  url: string
}

export enum InputEnum {
  Id = 'id',
  Title = 'title',
  Description = 'description',
  Url = 'url',
}

function Index() {
  const [tools, setTools] = useState<Array<Tool>>([]);
  const firestore = useFirestore();
  const [inputData, setInputData] = useState<Partial<Tool>>({
    title: '',
    description: '',
    url: ''
  });
  const [formError, setFormError] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      const toolsCollection = collection(firestore, 'tools');
      const toolsQuery = query(toolsCollection);
      const querySnapshoy = await getDocs(toolsQuery);
      const fetchedData: Array<Tool> = [];
      querySnapshoy.forEach((doc) => {
        fetchedData.push({ id: doc.id, ...doc.data() } as Tool);
      });
      setTools(fetchedData);
    }

    fetchData();
  }, [tools]);

  const onUpdateTool = (id: string, data: Partial<Tool>) => {
    const docRef = doc(firestore, "tools", id);

    updateDoc(docRef, data)
      .then(docRef => {
        toast.success('Update succesfully!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  const onDeleteTool = (id: string) => {
    const docRef = doc(firestore, "tools", id);

    deleteDoc(docRef)
      .then(docRef => {
        toast.success('Delete succesfully!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  const handleInputChange = (field: InputEnum, value: string) => {
    setInputData({ ...inputData, [field]: value });
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const toolsCollection = collection(firestore, 'tools');
      const newTool: Partial<Tool> = {
        title: inputData.title,
        description: inputData.description,
        url: inputData.url
      }

      const docRef = await addDoc(toolsCollection, newTool);

      toast.success('Saved succesfully!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      setTools([...tools, { id: docRef.id, ...newTool }]);

      setInputData({
        title: '',
        description: '',
        url: ''
      });
    } catch (error) {
      setFormError(true);
    }
  }

  if (formError) {
    return <Page404 />
  }

  return (
    <>
      <Head title="TOP PAGE" />
      <div className="hero min-h-screen bg-slate-800">
        <div className="max-w-5xl mx-auto">

          <form className="flex" onSubmit={handleFormSubmit}>
            <input
              type="text"
              onChange={(e) => handleInputChange(InputEnum.Title, e.target.value)}
              value={inputData.title}
              placeholder="title"
              className="m-4 text-slate-50 bg-transparent border border-slate-700 focus:ring-slate-400 focus:outline-none p-4 rounded-lg"
            />
            <input
              type="text"
              onChange={(e) => handleInputChange(InputEnum.Description, e.target.value)}
              value={inputData.description}
              placeholder="description"
              className="m-4 text-slate-50 bg-transparent border border-slate-700 focus:ring-slate-400 focus:outline-none p-4 rounded-lg"
            />
            <input
              type="text"
              onChange={(e) => handleInputChange(InputEnum.Url, e.target.value)}
              value={inputData.url}
              placeholder="url"
              className="m-4 text-slate-50 bg-transparent border border-slate-700 focus:ring-slate-400 focus:outline-none p-4 rounded-lg"
            />
            <button
              type="submit"
              className="m-4 border border-purple-500 p5 rounded-lg transition-opacity bg-purple-600 bg-opacity-30 hover:bg-opacity-50 p-4 text-slate-50"
            >
              Add
            </button>
          </form>

          <table className="table w-full bg-transparent text-slate-50">
            <thead>
              <tr>
                <th className="bg-slate-900 border-slate-700">Title</th>
                <th className="bg-slate-900 border-slate-700">Description</th>
                <th className="bg-slate-900 border-slate-700">Url</th>
                <th className="bg-slate-900 border-slate-700">Config</th>
              </tr>
            </thead>
            <tbody>
              {
                tools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} onUpdate={onUpdateTool} onDelete={onDeleteTool} />
                ))
              }
            </tbody>
          </table>
        </div>
      </div >
      <ToastContainer />
    </>
  );
}

export default Index;
