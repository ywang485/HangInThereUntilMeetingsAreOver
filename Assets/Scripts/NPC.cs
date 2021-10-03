using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class NPC
{
    #region Constructor
    public NPC(int type, int importance) {
        _type = type;
        _importance = importance;
    }
    public NPC()
    {
        _type = Random.Range(0, NumNPCType);
        _importance = Random.Range(MinImportance, MaxImportance+1);
    }
    #endregion

    #region Properties
    public int Importance { get => _importance; }
    public int Type { get => _type; }
    #endregion

    #region Fields
    private int _importance;
    private int _type;
    #endregion

    #region Constants
    public static int NumNPCType = 3;
    public static int MinImportance = 0;
    public static int MaxImportance = 1;
    #endregion
}
