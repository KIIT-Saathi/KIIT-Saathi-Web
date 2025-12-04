"use client";

import { useEffect } from 'react';
import { useAuth } from './use-auth';
import { useToast } from '@/hooks/use-toast';

const HOSTED_URL = process.env.NEXT_PUBLIC_HOSTED_URL;

export function useGroupAutoLink() {
  const { user, session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user?.email || !session?.access_token) return;

    const autoLinkGroups = async () => {
      try {
        const response = await fetch(`/api/split-saathi/auto-link`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to auto-link groups:', errorData.error);
          return;
        }

        const result = await response.json();

        if (result.newGroups?.length > 0) {
          result.newGroups.forEach((group: any) => {
            toast({
              title: `🎉 You've been added to a group!`,
              description: `Group: "${group.name}" • Added by: ${group.creatorName}${
                group.creatorRollNumber ? ` (${group.creatorRollNumber})` : ''
              } • Your roll number: ${group.rollNumber}`,
              duration: 6000,
              className:
                "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-none",
            });
          });
        }
      } catch (error) {
        console.error('Error during group auto-link:', error);
      }
    };

    const timeoutId = setTimeout(autoLinkGroups, 1000);
    return () => clearTimeout(timeoutId);
  }, [user, session, toast]);
}
