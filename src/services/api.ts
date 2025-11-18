import { supabase } from './supabase';

export const getExams = async () => {
  const { data, error } = await supabase.from('exams').select('*');
  if (error) throw error;
  return data;
};

export const getExamById = async (id: string) => {
  const { data, error } = await supabase.from('exams').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

export const getResults = async (userId: string) => {
  const { data, error } = await supabase.from('results').select('*').eq('user_id', userId);
  if (error) throw error;
  return data;
};

export const getResultById = async (id: string) => {
  const { data, error } = await supabase.from('results').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};
