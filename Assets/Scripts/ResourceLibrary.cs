using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public static class ResourceLibrary
{
    public static string MeetingBlockSpritePath = "Sprites/ScheduleIcons";
    public static string NPCSpritePath = "Sprites/NPCs";

    public static int[,] NPCIconIDs = new int[3, 2] { { 1, 0}, { 3, 2}, { 4, 5} };
    public static int[,] NPCSpriteIDs = new int[3, 2] { { 0, 1 }, { 2, 3 }, { 4, 5 } };

    public static int BreakIconID = 6;

    public static string ClickSFXPath = "SFX/Click";
    public static string HeartRestoredSFXPath = "SFX/HeartRestored";
    public static string RelationIncreasedSFXPath = "SFX/RelatedIncreased";
    public static string RelationDecreasedSFXPath = "SFX/RelationDecreased";
}
