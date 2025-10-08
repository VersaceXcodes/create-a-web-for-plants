import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { forumPostSchema } from '@/db/zodschemas';
import { useAppStore } from '@/store/main';

interface ForumPost {
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  topic: string;
}

const UV_Forum: React.FC = () => {
  const authState = useAppStore((state) => state.authentication_state);
  const { data: forumPosts, error, isLoading } = useQuery<ForumPost[]>('forumPosts', async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/forum`);
    return response.data.map((post: any) => forumPostSchema.parse(post));
  });

  useEffect(() => {
    // Add any required effect logic here
  }, [authState]);

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Community Forum</h1>
          <p className="mt-4 text-gray-600">Engage in discussions about plant care, plant identification, and problem-solving.</p>

          {isLoading && (
            <div className="flex justify-center mt-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mt-6">
              <p>Failed to load forum posts. Please try again later.</p>
            </div>
          )}

          {!isLoading && !error && forumPosts && forumPosts.length > 0 && (
            <ul className="mt-6 space-y-6">
              {forumPosts.map((post) => (
                <li key={post.post_id} className="p-6 bg-white shadow-lg rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-800">{post.topic}</h3>
                  <p className="mt-2 text-gray-700">{post.content}</p>
                  <div className="mt-4 text-sm text-gray-500">
                    <p>Posted by User ID: {post.user_id} on {new Date(post.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="mt-4 flex justify-end space-x-4">
                    <Link to={`/profile/${post.user_id}`} className="text-blue-600 hover:text-blue-500">View Profile</Link>
                    {/* Placeholder for comment or upvote functionality */}
                    <button className="text-green-600 hover:text-green-500">Upvote</button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {!isLoading && !error && (!forumPosts || forumPosts.length === 0) && (
            <div className="text-center text-gray-600 mt-12">
              <p>No discussions are available at the moment. Be the first to create a post!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UV_Forum;