using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class RemainingMeetingsCounter : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        _gameManager = GameManager.GetInstance();
        _indicatorText = gameObject.GetComponentInChildren<Text>();
    }

    // Update is called once per frame
    void Update()
    {
        _indicatorText.text = "Remaining Meetings: " + _gameManager.RemainingMeetings.ToString();
        
        
    }

    private Text _indicatorText;
    private GameManager _gameManager;
}
