"use client";

export default function MatchCentreTabs() {

  return (

    <div className="flex gap-3 border-b pb-4">

      <button className="rounded-lg bg-red-600 px-4 py-2 text-white">

        Overview

      </button>

      <button className="rounded-lg px-4 py-2 text-gray-500">

        Timeline

      </button>

      <button className="rounded-lg px-4 py-2 text-gray-500">

        Statistics

      </button>

      <button className="rounded-lg px-4 py-2 text-gray-500">

        Players

      </button>

      <button className="rounded-lg px-4 py-2 text-gray-500">

        Analysis

      </button>

    </div>

  );

}