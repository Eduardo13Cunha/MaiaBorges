import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config(); // Load .env variables

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Missing Supabase environment variables!");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const handler: Handler = async (event) => {
  try {
    switch (event.httpMethod) {
      case 'GET':
        const { data, error } = await supabase.from("clientes").select("*");
        if (error) throw error;
        return {
          statusCode: 200,
          body: JSON.stringify({ status: "success", data })
        };

      case 'POST':
        const { nome, email, numero } = JSON.parse(event.body!);
        const { data: newClient, error: postError } = await supabase
          .from("clientes")
          .insert([{ nome, email, numero }])
          .select()
          .single();
        
        if (postError) throw postError;
        return {
          statusCode: 201,
          body: JSON.stringify({ message: "Cliente adicionado com sucesso", data: newClient })
        };

      case 'DELETE':
        const id = event.path.split('/').pop();
        const { error: deleteError } = await supabase
          .from("clientes")
          .delete()
          .eq("id_cliente", id);
        
        if (deleteError) throw deleteError;
        return { statusCode: 204 };

      case 'PUT':
        const clientId = event.path.split('/').pop();
        const updates = JSON.parse(event.body!);
        const { data: updatedClient, error: putError } = await supabase
          .from("clientes")
          .update(updates)
          .eq("id_cliente", clientId)
          .select()
          .single();
        
        if (putError) throw putError;
        return {
          statusCode: 200,
          body: JSON.stringify(updatedClient)
        };

      default:
        return {
          statusCode: 405,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};